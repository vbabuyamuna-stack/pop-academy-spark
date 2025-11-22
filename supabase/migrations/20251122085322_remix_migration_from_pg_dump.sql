CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'student'
);


--
-- Name: calculate_course_progress(uuid, text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_course_progress(_user_id uuid, _course_id text, _total_exercises integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
  completed_count integer;
begin
  select count(*)
  into completed_count
  from public.exercise_completions
  where user_id = _user_id
    and course_id = _course_id;
  
  return least(100, round((completed_count::float / _total_exercises) * 100));
end;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  -- Insert profile
  insert into public.profiles (id, full_name, student_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.raw_user_meta_data->>'student_id'
  );
  
  -- Assign default 'student' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'student');
  
  return new;
end;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


SET default_table_access_method = heap;

--
-- Name: course_enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id text NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now() NOT NULL,
    progress_percentage integer DEFAULT 0 NOT NULL,
    last_accessed_at timestamp with time zone,
    completed_at timestamp with time zone,
    CONSTRAINT course_enrollments_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100)))
);


--
-- Name: daily_practice_problems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_practice_problems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id text NOT NULL,
    title text NOT NULL,
    description text,
    pdf_url text NOT NULL,
    difficulty text DEFAULT 'medium'::text,
    day_number integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: exercise_completions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exercise_completions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id text NOT NULL,
    exercise_id text NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL,
    score integer,
    time_spent_seconds integer
);


--
-- Name: game_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.game_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id uuid,
    user_id uuid NOT NULL,
    score integer NOT NULL,
    time_seconds integer,
    completed_at timestamp with time zone DEFAULT now()
);


--
-- Name: games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.games (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id text NOT NULL,
    title text NOT NULL,
    description text,
    game_type text NOT NULL,
    difficulty text DEFAULT 'medium'::text,
    config jsonb DEFAULT '{}'::jsonb,
    high_scores jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: lesson_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id text NOT NULL,
    title text NOT NULL,
    description text,
    pdf_url text NOT NULL,
    week_number integer,
    day_number integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text NOT NULL,
    student_id text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: resource_bookmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_bookmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id text NOT NULL,
    resource_type text NOT NULL,
    resource_id text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id text NOT NULL,
    title text NOT NULL,
    description text,
    video_url text NOT NULL,
    thumbnail_url text,
    duration_seconds integer,
    category text DEFAULT 'lesson'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: course_enrollments course_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_pkey PRIMARY KEY (id);


--
-- Name: course_enrollments course_enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: daily_practice_problems daily_practice_problems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_practice_problems
    ADD CONSTRAINT daily_practice_problems_pkey PRIMARY KEY (id);


--
-- Name: exercise_completions exercise_completions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise_completions
    ADD CONSTRAINT exercise_completions_pkey PRIMARY KEY (id);


--
-- Name: exercise_completions exercise_completions_user_id_course_id_exercise_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise_completions
    ADD CONSTRAINT exercise_completions_user_id_course_id_exercise_id_key UNIQUE (user_id, course_id, exercise_id);


--
-- Name: game_scores game_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_scores
    ADD CONSTRAINT game_scores_pkey PRIMARY KEY (id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: lesson_plans lesson_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: resource_bookmarks resource_bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_bookmarks
    ADD CONSTRAINT resource_bookmarks_pkey PRIMARY KEY (id);


--
-- Name: resource_bookmarks resource_bookmarks_user_id_course_id_resource_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_bookmarks
    ADD CONSTRAINT resource_bookmarks_user_id_course_id_resource_id_key UNIQUE (user_id, course_id, resource_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: idx_course_enrollments_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_enrollments_course_id ON public.course_enrollments USING btree (course_id);


--
-- Name: idx_course_enrollments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_enrollments_user_id ON public.course_enrollments USING btree (user_id);


--
-- Name: idx_dpp_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_dpp_course ON public.daily_practice_problems USING btree (course_id);


--
-- Name: idx_exercise_completions_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercise_completions_course_id ON public.exercise_completions USING btree (course_id);


--
-- Name: idx_exercise_completions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercise_completions_user_id ON public.exercise_completions USING btree (user_id);


--
-- Name: idx_game_scores_game; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_game_scores_game ON public.game_scores USING btree (game_id);


--
-- Name: idx_game_scores_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_game_scores_user ON public.game_scores USING btree (user_id);


--
-- Name: idx_games_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_games_course ON public.games USING btree (course_id);


--
-- Name: idx_lesson_plans_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lesson_plans_course ON public.lesson_plans USING btree (course_id);


--
-- Name: idx_profiles_full_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_full_name ON public.profiles USING btree (full_name);


--
-- Name: idx_resource_bookmarks_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resource_bookmarks_course_id ON public.resource_bookmarks USING btree (course_id);


--
-- Name: idx_resource_bookmarks_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resource_bookmarks_user_id ON public.resource_bookmarks USING btree (user_id);


--
-- Name: idx_user_roles_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_role ON public.user_roles USING btree (role);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: idx_videos_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_videos_course ON public.videos USING btree (course_id);


--
-- Name: daily_practice_problems update_dpp_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_dpp_updated_at BEFORE UPDATE ON public.daily_practice_problems FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: games update_games_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON public.games FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lesson_plans update_lesson_plans_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_lesson_plans_updated_at BEFORE UPDATE ON public.lesson_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: videos update_videos_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: course_enrollments course_enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercise_completions exercise_completions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise_completions
    ADD CONSTRAINT exercise_completions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: game_scores game_scores_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_scores
    ADD CONSTRAINT game_scores_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: resource_bookmarks resource_bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_bookmarks
    ADD CONSTRAINT resource_bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: daily_practice_problems Admins can manage DPPs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage DPPs" ON public.daily_practice_problems USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: games Admins can manage games; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage games" ON public.games USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: lesson_plans Admins can manage lesson plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage lesson plans" ON public.lesson_plans USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: videos Admins can manage videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage videos" ON public.videos USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: resource_bookmarks Admins can view all bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all bookmarks" ON public.resource_bookmarks FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: exercise_completions Admins can view all completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all completions" ON public.exercise_completions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: course_enrollments Admins can view all enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all enrollments" ON public.course_enrollments FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: game_scores Admins can view all scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all scores" ON public.game_scores FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: daily_practice_problems Everyone can view DPPs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view DPPs" ON public.daily_practice_problems FOR SELECT USING (true);


--
-- Name: games Everyone can view games; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view games" ON public.games FOR SELECT USING (true);


--
-- Name: lesson_plans Everyone can view lesson plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view lesson plans" ON public.lesson_plans FOR SELECT USING (true);


--
-- Name: videos Everyone can view videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view videos" ON public.videos FOR SELECT USING (true);


--
-- Name: exercise_completions Users can create their own completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own completions" ON public.exercise_completions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: course_enrollments Users can create their own enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own enrollments" ON public.course_enrollments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: game_scores Users can create their own scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own scores" ON public.game_scores FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: resource_bookmarks Users can manage their own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own bookmarks" ON public.resource_bookmarks USING ((auth.uid() = user_id));


--
-- Name: course_enrollments Users can update their own enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own enrollments" ON public.course_enrollments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: resource_bookmarks Users can view their own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own bookmarks" ON public.resource_bookmarks FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: exercise_completions Users can view their own completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own completions" ON public.exercise_completions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: course_enrollments Users can view their own enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: game_scores Users can view their own scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own scores" ON public.game_scores FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: course_enrollments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

--
-- Name: daily_practice_problems; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.daily_practice_problems ENABLE ROW LEVEL SECURITY;

--
-- Name: exercise_completions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.exercise_completions ENABLE ROW LEVEL SECURITY;

--
-- Name: game_scores; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

--
-- Name: games; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: resource_bookmarks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: videos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


